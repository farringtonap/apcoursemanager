'use server';

import { hash } from 'bcrypt';
import { Teacher, APClass, Subject, PreRequisite } from '@prisma/client';
import { prisma } from './prisma';

/**
 * Creates a new user in the database.
 * @param credentials, an object with the following properties: email, password.
 */
export async function createUser(credentials: { email: string; password: string }) {
  const password = await hash(credentials.password, 10);
  const newUser = await prisma.user.create({
    data: {
      email: credentials.email,
      password,
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
 * Creates a new teacher in the database.
 * @param teacher, an object with the following properties: firstName, lastName, email, subject.
 */
export async function createTeacher(teacher: { firstName: string; lastName: string; email: string; subject: string }) {
  const subject = await prisma.subject.findUnique({
    where: { name: teacher.subject },
  });

  if (!subject) {
    throw new Error(`Subject "${teacher.subject}" not found.`);
  }

  const newTeacher = await prisma.teacher.create({
    data: {
      firstName: teacher.firstName,
      lastName: teacher.lastName,
      email: teacher.email,
      subjectId: subject.id,
    },
  });

  return newTeacher;
}

/**
 * Updates an existing teacher in the database.
 * @param teacher, an object with the following properties: id, firstName, lastName, email, subject.
 */
export async function updateTeacher(teacher: Teacher) {
  const updatedTeacher = await prisma.teacher.update({
    where: { id: teacher.id },
    data: {
      firstName: teacher.firstName,
      lastName: teacher.lastName,
      email: teacher.email,
      subjectId: teacher.subjectId,
    },
  });

  return updatedTeacher;
}

/**
 * Deletes an existing teacher from the database.
 * @param id, the id of the teacher to delete.
 */
export async function deleteTeacher(id: number) {
  await prisma.teacher.delete({
    where: { id },
  });
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
    subject: string;
    teacherEmail: string;
    gradeLevels: number[]
  },
) {
  const subject = await prisma.subject.findUnique({
    where: { name: apClass.subject },
  });

  const teacher = await prisma.teacher.findUnique({
    where: { email: apClass.teacherEmail },
  });

  if (!subject || !teacher) {
    throw new Error('Subject or Teacher not found.');
  }

  const gradeLevels = await prisma.gradeLevel.findMany({
    where: {
      level: { in: apClass.gradeLevels },
    },
  });

  const newAPClass = await prisma.aPClass.create({
    data: {
      name: apClass.name,
      description: apClass.description,
      offered: apClass.offered,
      subjectId: subject.id,
      teacherId: teacher.id,
      gradeLevels: {
        connect: gradeLevels.map(g => ({ id: g.id })),
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
export async function updateAPClass(apClass: APClass & { gradeLevel: { id: number }[] }) {
  const updatedAPClass = await prisma.aPClass.update({
    where: { id: apClass.id },
    data: {
      name: apClass.name,
      description: apClass.description,
      offered: apClass.offered,
      subjectId: apClass.subjectId,
      teacherId: apClass.teacherId,
      gradeLevels: {
        connect: apClass.gradeLevel.map((g: { id: number }) => ({ id: g.id })),
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
