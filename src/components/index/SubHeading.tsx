import { FC } from "react"

interface Props {
    name: string
}

const SubHeading: FC<Props> = ({ name }: Props) => {
    return (
        <div
            css={{
                display: "flex",
                alignItems: "center",
                width: "100%",
            }}
        >
            <h2 css={{ fontWeight: "normal", marginRight: 20 }}>{name}</h2>
            <hr
                css={{
                    border: "none",
                    background: "#9c9c9c",
                    height: 1,
                    width: "100%",
                    marginTop: 14,
                }}
            />
        </div>
    )
}

export default SubHeading
