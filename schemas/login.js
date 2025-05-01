import z from 'zod'; 

const loginSchema = z.object({
    email: z.string().email(),
    pass: z.string().min(3)
})

export function validateLoginReq (object){
    return loginSchema.safeParse(object)
}

