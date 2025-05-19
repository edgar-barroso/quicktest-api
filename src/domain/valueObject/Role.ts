import { ValidationError } from "../error/ValidationError";

const validRoles = ["STUDENT", "TEACHER"];

export class Role{
    constructor(private role: string){
        if (!role) throw new ValidationError("Role is required");
        if (!validRoles.includes(role)) throw new ValidationError("Role is invalid");
        this.role = role
    }
    
    getValue() {
      return this.role;
    }
}