export class VaccineeInformation {
    public email: String;
    public familyName: String;
    public name: String;
    public birth: String;
    public phone: String;
    public adress: String;
    constructor(_email: String, _familyName: String, _name: String, _birth: String, _phone: String, _adress: String) {
        this.email = _email;
        this.familyName = _familyName;
        this.name = _name;
        this.birth = _birth;
        this.phone = _phone;
        this.adress = _adress;
    }
}