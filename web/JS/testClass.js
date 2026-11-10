// Requiere cargar user.js antes que este archivo.
var user;                    // declarada, sin valor -> undefined
let otherUser;               // declarada, sin valor -> undefined
const anotherUser = new User(); // objeto User con todos sus campos undefined
 
// user y otherUser valen undefined: leer .id lanza TypeError.
// Con try/catch se ven las tres salidas sin que la primera corte el resto.
try {
    console.log(user.id);
} catch (e) {
    console.log('user:', e.message);
}
 
try {
    console.log(otherUser.id);
} catch (e) {
    console.log('otherUser:', e.message);
}
 
// anotherUser sí es un objeto: .id existe pero vale undefined (no lanza error)
console.log(anotherUser.id);


