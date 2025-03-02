import { PropertyState } from "../Enum/property-state";
import { PropertyType } from "../Enum/property-type";
import { TransactionType } from "../Enum/transaction-type";
import { Usuario } from "./usuario";

export class Anuncio {

    id?: number
    transactionType?: TransactionType
    propertyState?: PropertyState
    propertyType?: PropertyType
    numRooms?: number
    numBathrooms?: number
    squareMeters?: number
    elevator?: boolean
    pool?: boolean
    garage?: boolean
    paddleCourt?: boolean
    balcony?: boolean
    terrace?: boolean
    seaViews?: boolean
    storageRoom?: boolean
    address?: string
    seller?: Usuario
    photo?: Photo[]
    price?: number
    description?: string
    favoritos?: Usuario[]
    currentImageIndex?: number
    [key: string]: any
}

export interface Photo {
    id: number;
    photo: string;
    photoIndex: number;
  }