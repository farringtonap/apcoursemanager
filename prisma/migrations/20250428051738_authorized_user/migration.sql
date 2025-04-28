-- CreateTable
CREATE TABLE "AuthorizedUser" (
    "email" TEXT NOT NULL,

    CONSTRAINT "AuthorizedUser_pkey" PRIMARY KEY ("email")
);

-- CreateIndex
CREATE UNIQUE INDEX "AuthorizedUser_email_key" ON "AuthorizedUser"("email");
