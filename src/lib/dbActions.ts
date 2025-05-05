'use server';

import { hash } from 'bcrypt';
import { Subject, PreRequisite, Role } from '@prisma/client';
import { prisma } from './prisma';

/**
 * Creates a new user in the database.
 * @param credentials, an object with the following properties: email, password.
 */
export async function createUser(info: {
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  role: string }) {
  const password = await hash(info.password, 10);
  const newUser = await prisma.user.create({
    data: {
      email: info.email,
      password,
      firstName: info.firstName,
      lastName: info.lastName,
      role: info.role as Role,
    },
  });
  return newUser;
}

/**
 * Changes the password of an existing user in the database.
 * @param credentials, an object with the following properties: email, password.
 */
export async function changePassword(credentials: { email: string; password: string }) {
  const password = await hash(credentials.password, 10);
  const updatedUser = await prisma.user.update({
    where: { email: credentials.email },
    data: {
      password,
    },
  });
  return updatedUser;
}

/**
 * Creates a new AP class in the database.
 * @param apClass, an object with the following properties: name, description, offered, subject,
 * teacherEmail, gradeLevels.
 */
export async function createAPClass(
  apClass: {
    name: string;
    description: string;
    offered: boolean;
    subjectType: string;
    teacherEmail: string;
    gradeLevels: number[]
    preRequisiteIds: number[];
  },
) {
  // 1. Check if a class with the same name already exists
  const existingClass = await prisma.aPClass.findUnique({
    where: { name: apClass.name },
  });

  if (existingClass) {
    throw new Error(`A class with the name "${apClass.name}" already exists.`);
  }

  // 2. Look up the subject and teacher
  const subject = await prisma.subject.findUnique({
    where: { name: apClass.subjectType },
  });

  const teacher = await prisma.user.findUnique({
    where: { email: apClass.teacherEmail },
  });

  if (!subject || !teacher) {
    throw new Error('Subject or Teacher not found.');
  }

  // 3. Resolve grade level IDs
  const gradeLevels = await prisma.gradeLevel.findMany({
    where: {
      level: { in: apClass.gradeLevels },
    },
  });

  // 4. Resolve prerequisite IDs
  const preRequisites = await prisma.preRequisite.findMany({
    where: {
      id: { in: apClass.preRequisiteIds },
    },
  });

  // 4. Create new AP class
  const newAPClass = await prisma.aPClass.create({
    data: {
      name: apClass.name,
      description: apClass.description,
      offered: apClass.offered,
      subjectId: subject.id,
      teacherEmail: teacher.email,
      gradeLevels: {
        connect: gradeLevels.map(g => ({ id: g.id })),
      },
      prerequisites: {
        connect: preRequisites.map(p => ({ id: p.id })),
      },
    },
  });
  return newAPClass;
}

/**
 * Updates an existing AP class in the database.
 * @param apClass, an object with the following properties: id, name, description, offered, subject,
 * teacherEmail, gradeLevels.
 */
export async function updateAPClass(apClass: {
  id: number;
  name: string;
  description: string;
  offered: boolean;
  subjectId: number;
  teacherEmail: string;
  gradeLevel: { id: number }[];
  preRequisiteIds: number[];
}) {
  const updatedAPClass = await prisma.aPClass.update({
    where: { id: apClass.id },
    data: {
      name: apClass.name,
      description: apClass.description,
      offered: apClass.offered,
      subjectId: apClass.subjectId,
      teacherEmail: apClass.teacherEmail,
      gradeLevels: {
        set: apClass.gradeLevel.map((g) => ({ id: g.id })),
      },
      prerequisites: {
        set: apClass.preRequisiteIds.map((id) => ({ id })),
      },
    },
  });

  return updatedAPClass;
}

/**
 * Deletes an existing AP class from the database.
 * @param id, the id of the AP class to delete.
 */
export async function deleteAPClass(id: number) {
  await prisma.aPClass.delete({
    where: { id },
  });
}

/**
 * Retrieves all AP classes from the database, including subject info.
 */
export async function getAllAPClasses() {
  const classes = await prisma.aPClass.findMany({
    include: {
      subject: true,
      teacher: true,
      gradeLevels: true,
      prerequisites: true, // assumes there's a Subject relation via subjectId
    },
    orderBy: {
      name: 'asc',
    },
  });

  return classes;
}

/**
 * Creates a new subject in the database.
 * @param subject, an object with the following properties: name.
 */
export async function createSubject(subject: { name: string }) {
  const newSubject = await prisma.subject.create({
    data: {
      name: subject.name,
    },
  });

  return newSubject;
}

/**
 * Updates an existing subject in the database.
 * @param subject, an object with the following properties: id, name.
 */
export async function updateSubject(subject: Subject) {
  const updatedSubject = await prisma.subject.update({
    where: { id: subject.id },
    data: {
      name: subject.name,
    },
  });

  return updatedSubject;
}

/**
 * Deletes an existing subject from the database.
 * @param id, the id of the subject to delete.
 */
export async function deleteSubject(id: number) {
  await prisma.subject.delete({
    where: { id },
  });
}

/**
 * Retrieves all subjects from the database.
 */
export async function getAllSubjects() {
  const subjects = await prisma.subject.findMany({
    orderBy: {
      name: 'asc',
    },
  });

  return subjects;
}

/**
 * Creates a new prerequisite in the database.
 * @param prerequisite, an object with the following properties: name, subject, gradeLevels.
 */
export async function createPreRequisite(prerequisite: { name: string; subject: string; gradeLevels: number[] }) {
  const subject = await prisma.subject.findUnique({
    where: { name: prerequisite.subject },
  });

  if (!subject) {
    throw new Error(`Subject "${prerequisite.subject}" not found.`);
  }

  const gradeLevels = await prisma.gradeLevel.findMany({
    where: {
      level: { in: prerequisite.gradeLevels },
    },
  });

  const newPreRequisite = await prisma.preRequisite.create({
    data: {
      name: prerequisite.name,
      subjectId: subject.id,
      gradeLevels: {
        connect: gradeLevels.map(g => ({ id: g.id })),
      },
    },
  });

  return newPreRequisite;
}

/**
 * Updates an existing prerequisite in the database.
 * @param prerequisite, an object with the following properties: id, name, subject, gradeLevels.
 */
export async function updatePreRequisite(prerequisite: PreRequisite & { gradeLevel: { id: number }[] }) {
  const updatedPreRequisite = await prisma.preRequisite.update({
    where: { id: prerequisite.id },
    data: {
      name: prerequisite.name,
      subjectId: prerequisite.subjectId,
      gradeLevels: {
        connect: prerequisite.gradeLevel.map((g: { id: number }) => ({ id: g.id })),
      },
    },
  });

  return updatedPreRequisite;
}

/**
 * Deletes an existing prerequisite from the database.
 * @param id, the id of the prerequisite to delete.
 */
export async function deletePreRequisite(id: number) {
  await prisma.preRequisite.delete({
    where: { id },
  });
}

export interface CreateStudentProfileDTO {
  interests: string[];//  store a JSON array of strings
  previousCourses: string[];
  GPA: number;
  gradeLevel?: number; // optional, since your schema allows null

}

export async function createStudentProfile(data: CreateStudentProfileDTO) {
  return prisma.studentProfile.create({
    data: {
      interests: data.interests,
      previousCourses: data.previousCourses,
      GPA: data.GPA,
      gradeLevel: data.gradeLevel,
    },
  });
}

export async function getAllStudentProfiles() {
  return prisma.studentProfile.findMany({
    orderBy: { createdAt: 'asc' },
  });
}

/**
 * Retrieves all prerequisites from the database, including subject and grade level info.
 */
export async function getAllPreRequisites() {
  const prerequisites = await prisma.preRequisite.findMany({
    include: {
      subject: true,
      gradeLevels: true,
    },
    orderBy: {
      name: 'asc',
    },
  });

  return prerequisites;
}
