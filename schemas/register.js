import z from 'zod'; 

const registerSchema = z.object({
    email: z.string().email(),
    pass: z.string().min(3),
    userName: z.string().min(3)

})

export function validateRegisterReq (object){
    return registerSchema.safeParse(object)
}

