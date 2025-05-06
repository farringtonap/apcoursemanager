/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
import { PrismaClient, Role } from '@prisma/client';
import { hash } from 'bcrypt';
import * as config from '../config/settings.development.json';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding the database');

  // Seed users
  const password = await hash('changeme', 10);
  for (const account of config.defaultAccounts) {
    const role = account.role as Role || Role.TEACHER;
    console.log(`  Creating user: ${account.email} with role: ${role}`);
    await prisma.user.upsert({
      where: { email: account.email },
      update: {},
      create: {
        firstName: account.firstName,
        lastName: account.lastName,
        email: account.email,
        password,
        role,
      },
    });
  }

  // Optional: Seed grade levels
  for (const level of config.gradeLevels) {
    console.log(`  Creating grade level: ${level}`);
    await prisma.gradeLevel.upsert({
      where: { level },
      update: {},
      create: { level },
    });
  }

  // Optional: Seed subjects
  for (const subjectName of config.subjects) {
    console.log(`  Creating subject: ${subjectName}`);
    await prisma.subject.upsert({
      where: { name: subjectName },
      update: {},
      create: { name: subjectName },
    });
  }

  // Seed AP classes
  if (!config.apClasses) {
    console.warn('No AP classes found in the configuration.');
    return;
  }
  const usedTeacherEmails = new Set<string>();

  for (const c of config.apClasses) {
    if (usedTeacherEmails.has(c.teacherEmail)) {
      console.warn(`⚠️ Skipping AP class "${c.name}" — teacher ${c.teacherEmail} already assigned.`);
      continue;
    }

    const subject = await prisma.subject.findUnique({ where: { name: c.subject } });

    if (!subject) {
      console.warn(`Skipping AP class "${c.name}" — subject "${c.subject}" not found.`);
      continue;
    }

    const gradeLevels = await prisma.gradeLevel.findMany({
      where: { level: { in: c.gradeLevels } },
    });

    console.log(`  Creating AP class: ${c.name}`);
    await prisma.aPClass.create({
      data: {
        name: c.name,
        description: c.description,
        offered: c.offered,
        subjectId: subject.id,
        teacherEmail: c.teacherEmail,
        gradeLevels: {
          connect: gradeLevels.map(g => ({ id: g.id })),
        },
      },
    });
    usedTeacherEmails.add(c.teacherEmail);
  }
  for (const prereq of config.prerequesites) {
    const subject = await prisma.subject.findUnique({
      where: { name: prereq.subject },
    });

    if (!subject) {
      console.warn(`⚠️  Skipping prerequisite "${prereq.name}" — subject "${prereq.subject}" not found.`);
      // eslint-disable-next-line no-continue
      continue;
    }

    console.log(`  Creating prerequisite: ${prereq.name} for subject: ${prereq.subject}`);

    const gradeLevelConnections = await Promise.all(
      prereq.gradeLevels.map(async (level: number) => {
        const gl = await prisma.gradeLevel.findUnique({ where: { level } });
        if (!gl) {
          console.warn(`⚠️  Grade level ${level} not found — skipping.`);
          return null;
        }
        return { id: gl.id };
      }),
    );

    const apClasses = await Promise.all(
      prereq.apClasses.map(async (ap : string) => {
        const apClass = await prisma.aPClass.findFirst({ where: { name: ap } });
        if (!apClass) {
          console.warn(`⚠️  Grade level ${ap} not found — skipping.`);
          return null;
        }
        return { id: apClass.id };
      }),

    );

    await prisma.preRequisite.upsert({
      where: {
        id: config.prerequesites.indexOf(prereq) + 1,
      },
      update: {},
      create: {
        name: prereq.name,
        subjectId: subject.id,
        gradeLevels: {
          connect: gradeLevelConnections.filter((gl): gl is { id: number } => gl !== null),
        },
        apClasses: {
          connect: apClasses.filter((val) => val !== null),
        },
      },
    });
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
