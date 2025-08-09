import {email, z} from "zod"

const userFormSchema = z.object({
    name: z.string("Vous devez entrer un mon."),
    email: z.string().email("Vous devez entrer une adresse valide."),
    password: z.string().min(6, "Le mot de passe doit contenir au moins 6 carateres.")
})