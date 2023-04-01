import { FunctionComponent } from "react";
import Image from "next/image";

const AddButton: FunctionComponent = () => {

    return (
        <Image
            src='/icons/add-icon.svg'
            width={30}
            height={30}
            alt='add icon'
        />
    )
}

export default AddButton