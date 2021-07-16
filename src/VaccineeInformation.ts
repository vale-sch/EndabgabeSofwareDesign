export class VaccineeInformation {
    public email: string;
    public familyName: string;
    public name: string;
    public birth: string;
    public phone: string;
    public adress: string;
    constructor(_email: string, _familyName: string, _name: string, _birth: string, _phone: string, _adress: string) {
        this.email = _email;
        this.familyName = _familyName;
        this.name = _name;
        this.birth = _birth;
        this.phone = _phone;
        this.adress = _adress;
    }
}