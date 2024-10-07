import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("customers")
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullname: string;

  @Column()
  phone: string;

  @Column()
  address: string;
}
