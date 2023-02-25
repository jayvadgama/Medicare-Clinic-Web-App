
const fs = require('fs');


class User {
    constructor(userId,username) {
      this.username = username;
      this.userId = userId;
    }

    
  }

  class Practitioner extends User{
    constructor(userId,username){
      super(userId,username);
    }

    fetchPatient= (patientId)=>{
      const patients = JSON.parse(fs.readFileSync('./Data/patients.json'));
      const patient = patients.find(u => u.id === patientId);
      return patient
    };

    fetchAllPatients= ()=>{
      let patients = [];
      patients = JSON.parse(fs.readFileSync('./Data/patients.json'));
      return patients
    };

    setPatient= (patient)=>{
      let patients = [];
      patients = JSON.parse(fs.readFileSync('./Data/patients.json', 'utf8'));
      if (patients.find(usr => usr.id === patient.id)) {
        return { error: 'Id is taken!' };
      }else{
        patients.push(patient)
        fs.writeFileSync('./Data/patients.json', JSON.stringify(patients));
        return patients
      }
    };

    deletePatient= (patientId)=>{
      const patients = JSON.parse(fs.readFileSync('./Data/patients.json'));
      const patient = patients.find(u => u.id === patientId);
      patients.pop(patient)
      return patients
    };
  }

  class Doctor extends Practitioner {
    constructor(userId,username, user_type) {
      super(userId,username);
      this.user_type = user_type;
    }

    fetchRecords= (patientId)=>{
      const records = JSON.parse(fs.readFileSync('./Data/records.json'));
      const record = records.find(u => u.patientid === patientId);
      return record
    };

  }

  class Receiptionist extends Practitioner {
    constructor(userId,username, user_type) {
      super(userId,username);
      this.user_type = user_type;
    }
    
  }


  rec= new Receiptionist(1,"abdi","doctor");
  const patient={"id":2,"name":"Sensei Cop","age":32,"gender":"male","contact":"07503476484","address":"Mombasa"}
  console.log(rec.setPatient(patient))
