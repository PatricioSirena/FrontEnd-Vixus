import CardC from "../components/CardC"
import Carrousel from "../components/Carrousel"

const HomePage = () => {
    return (
        <>
        <Carrousel />
        <CardC id={'cardInfo'} />
        <CardC id={'cardLinks'}/>
        <CardC />
        </>
    )
}

export default HomePage