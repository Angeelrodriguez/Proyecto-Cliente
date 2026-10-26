class User{
    constructor(id, firstName, lastName, middleInitial, street, city, state, zip, phone, email, password){
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.middleInitial = middleInitial;
    this.street = street;
    this.city = city;
    this.state = zip;
    this.phone = phone;
    this.email = email;
    this.password = password;
    }
    static fromJSON(json){
    return new User(
            json.id,
            json.firstName,
            json.lastName,
            json.middleInitial,
            json.street,
            json.city,
            json.zip,
            json.phone,
            json.email,
            json.password
                );}
    }
};

