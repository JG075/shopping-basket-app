import Product from "../models/product"

const MOCK_RESPONSE = {
    result: [
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
    return new Promise((success) => {
        setTimeout(() => {
            const parsedReponse = MOCK_RESPONSE.result.map((p) => {
                return new Product(p)
            })
            success(parsedReponse)
        }, 2000)
    })
}

export default {
    get,
}
