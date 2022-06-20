import Product from "../models/product"

export interface SuccessResponse {
    data: Product[]
}

interface RejectResponse {
    error: {
        status: number
        message: string
    }
}

const MOCK_RESPONSE = {
    data: [
        {
            id: 1,
            name: "Face Mask",
            thumbnail: "/facemask.jpg",
            cost: 2.5,
        },
        {
            id: 2,
            name: "Toilet Roll",
            thumbnail: "/toiletroll.jpg",
            cost: 0.65,
        },
    ],
}

const get = () => {
    return new Promise((success: (arg: SuccessResponse) => void, reject: (arg: RejectResponse) => void) => {
        setTimeout(() => {
            const parsedReponse = MOCK_RESPONSE.data.map((p) => {
                return new Product(p)
            })
            success({ data: parsedReponse })
        }, 1000)
    })
}

const api = {
    get,
}

export default api
