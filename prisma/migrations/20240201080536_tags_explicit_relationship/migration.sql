-- CreateTable
CREATE TABLE "Tag" (
    "id" SERIAL NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "postTags" (
    "postId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,

    CONSTRAINT "postTags_pkey" PRIMARY KEY ("tagId","postId")
);

-- AddForeignKey
ALTER TABLE "postTags" ADD CONSTRAINT "postTags_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "postTags" ADD CONSTRAINT "postTags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
