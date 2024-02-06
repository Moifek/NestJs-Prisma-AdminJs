import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { INQUIRER, ModuleRef } from "@nestjs/core";

@Injectable()
export class CatsService {
  constructor(@Inject(INQUIRER) private readonly inquirer: object) {}

   getHello():  string {
    if(this.inquirer){
        console.log('inquerer:',this.inquirer);
        return 'hello'    
    }else{
        console.log('invoked without inquirer');
        return 'bye'
    }
    
}
}