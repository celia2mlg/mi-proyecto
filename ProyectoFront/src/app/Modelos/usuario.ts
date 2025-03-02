import { Anuncio } from "./anuncio"

export class Usuario {
    id?:number
    nombre?: string
    apellidos?: string
    email?: string
    password?: string
    telefono?: number
    favoritos?: Array<Anuncio>
    publicaciones?: Array<Anuncio>

}


export interface Credentials{
    email?: string,
    password?: string
}