-- Drop tables if they exist
DROP TABLE IF EXISTS "Setting";

-- Create Setting table
CREATE TABLE "Setting" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    
    CONSTRAINT "Setting_pkey" PRIMARY KEY ("id")
);

-- Create indexes
CREATE INDEX "Setting_name_idx" ON "Setting"("name"); 