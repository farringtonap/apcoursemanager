'use server';

import { hash } from 'bcrypt';
import { Subject, PreRequisite, Role } from '@prisma/client';
import { prisma } from './prisma';

/**
 * Creates a new user in the database.
 * @param info, an object with user information: first name,
 * last name, email, password, and role
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
 * Updates a User's information on the admin side
 * @param data a `User` object
 * @returns {Error} if there is problems with updating the user or an empty string if the user updated
 */
export async function updateUser(data:{
  id: number,
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  role: string,
}) {
  try {
    // This means admin did not update password and left it blank
    if (data.password === '') {
      await prisma.user.update({
        where: { id: data.id },
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          role: data.role as Role,
        },
      });
    } else {
      await prisma.user.update({
        where: { id: data.id },
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          role: data.role as Role,
          password: data.password,
        },
      });
    }
  } catch (err) {
    return (err);
  }
  return ('');
}

/**
 * Deletes a user from the database, this is effectively removing a site maintainer 
 * @param data an object containing the ID of the user
 * @returns {Error} if there was an issue deleting the user, otherwise, empty string
 */
export async function deleteUser(id:number) {
  try {
    await prisma.user.delete({where: { id }});
  } catch (err) {
    return (err);
  }

  return ('');
}

/**
 * Allows admins to add authorized site maintainers
 * @param info, an object containing the users email
*/
export async function createAuthorizedUser(info: { email: string, role: string }) {
  try {
    await prisma.authorizedUser.create({
      data: {
        email: info.email,
        role: info.role as Role,
      },
    });
  } catch (err) {
    return (err);
  }

  return ('');
}

/**
 * Updates an authorized user's permission level
 * @param data a `User` object
 * @returns {Error} or an empty String (represents okay)
 */
export async function updateAuthorizedUser(data:{
  id: number,
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  role: string,
}) {
  try {
    // Only want to update the permission / role level
    await prisma.user.update({
      where: { id: Number(data.id) },
      data: {
        role: data.role as Role,
      },
    });
  } catch (err) {
    return (err);
  }
  return ('');
}


/**
 * Allows admins to delete a site maintainer. This is similar to
 * revoking their access.
 * @param info, an object containing the users email
 */
export async function deleteAuthorizedUser(email: string) {
  await prisma.authorizedUser.delete({
    where: { email: email },
  });
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
  resources?: string | null;
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
      resources: apClass.resources,
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

// update teacher resources and class description
export async function updateTeacherClassFields(data: {
  id: number;
  description: string;
  resources: string;
}) {
  return prisma.aPClass.update({
    where: { id: data.id },
    data: {
      description: data.description,
      resources: data.resources,
    },
  });
}
