import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

export const profile = pgTable('profiles', {
  id: serial('id').primaryKey(),
  fullName: text('full_name'),
  phone: varchar('phone', { length: 256 }),
});

export const client = pgTable('clents',{
  id: serial('id').primaryKey(),
  fullName: text('full_name').notNull(),
  contactNumber: varchar('contact_number', { length: 256 }).notNull(),
  secondaryNumber:varchar('secondary_number', { length: 256 }),
  emailAddress: varchar('email_address', { length: 255 }).notNull(),
  companyName:text('company_name').notNull(),
  designation:text('desigantion').notNull()
})

export const project = pgTable('projects',{
  id:serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  

})