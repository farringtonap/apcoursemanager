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
    const role = account.role as Role || Role.USER;
    console.log(`  Creating user: ${account.email} with role: ${role}`);
    await prisma.user.upsert({
      where: { email: account.email },
      update: {},
      create: {
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
      },
    });
  }

  // Seed teachers
  for (const t of config.teachers) {
    const subject = await prisma.subject.findUnique({ where: { name: t.subject } });
    if (!subject) {
      console.warn(`  Subject "${t.subject}" not found for teacher ${t.email}`);
      // eslint-disable-next-line no-continue
      continue;
    }

    console.log(`  Creating teacher: ${t.email}`);
    await prisma.teacher.upsert({
      where: { email: t.email },
      update: {},
      create: {
        firstName: t.firstName,
        lastName: t.lastName,
        email: t.email,
        subjectId: subject.id,
      },
    });
  }

  // Seed AP classes
  if (!config.apClasses) {
    console.warn('No AP classes found in the configuration.');
    return;
  }
  for (const c of config.apClasses) {
    const subject = await prisma.subject.findUnique({ where: { name: c.subject } });
    const teacher = await prisma.teacher.findUnique({ where: { email: c.teacherEmail } });

    if (!subject || !teacher) {
      console.warn(`  Skipping AP class "${c.name}" - subject or teacher not found`);
      // eslint-disable-next-line no-continue
      continue;
    }

    // Find grade levels
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
        teacherId: teacher.id,
        gradeLevels: {
          connect: gradeLevels.map(g => ({ id: g.id })),
        },
        // prerequisites: skipped unless added in config
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
