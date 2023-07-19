import { CSSProperties, FunctionComponent, SyntheticEvent, useState } from "react";
import Image from "next/image";
import { UserList } from "../models/user";
import { Media } from "../models/media";

export type AddButtonProps = {
    media: Media | null;
    id: string | undefined;
    imgWidth?: number;
    imgHeight?: number;
    lists: UserList[];
    style?: CSSProperties;
    clickedButton: number | null;
}

const AddButton: FunctionComponent<AddButtonProps> = (props: AddButtonProps) => {
    const { id, media, imgWidth: width, imgHeight: height, lists, clickedButton } = props;
    const [addedToList, setAddedToList] = useState<boolean>(false);
    const [showMessageDiv, setShowMessageDiv] = useState<boolean>(false);
    const [state, changeState] = useState({ listName: lists[0]?.name || '', media: {} })
    const [message, setMessage] = useState<string>('');

    const handleAddToListClick = (e: React.MouseEvent, state: { listName: string, media: Media | null }) => {
        e.stopPropagation();
        fetch(`/api/addToList?userId=${id}`,
            {
                body: JSON.stringify({
                    listName: state.listName,
                    media: state.media
                }),
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
            }).catch((response) => response.json())
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "success") {
                    setAddedToList(addedToList => !addedToList);
                }
                else if (data.status === "error") {
                    setShowMessageDiv(!showMessageDiv);
                    setMessage(data.errors.join("\n"));
                    setTimeout(() => {
                        setShowMessageDiv(false);
                        setMessage('');
                    }, 1000);
                }
            })
    };

    const handleSelect = (e: SyntheticEvent<HTMLSelectElement, Event>) => {
        e.stopPropagation();
        const { value } = e.currentTarget;
        changeState((prevState) => ({
            ...prevState,
            listName: value,
        }));
    };

    return (
        <div style={{position:'relative'}}>
            {showMessageDiv ? <div className="error add-to-list-error">{message}</div> : <div/>}
            {clickedButton == media?.id ?
                <div id="add-to-list">
                    <select onChange={(e) => changeState({ ...state, listName: e.target.value })}
                        id="lists" name="lists" required
                        onClick={(e) => handleSelect(e)}
                    >
                        {lists.length === 0 ?
                            <option>No Lists</option>
                            :
                            lists?.map((list) =>
                                <option
                                    key={list.name}
                                    value={list.name}
                                >
                                    {list.name}
                                </option>
                            )
                        }
                    </select>

                    <Image
                        src={`/icons/${addedToList ? 'green-check.svg' : 'add-icon.svg'}`}
                        width={width}
                        height={height}
                        alt='add icon'
                        onClick={(e) => { handleAddToListClick(e, { ...state, media }) }}
                    />
                </div>
                :
                <Image
                    src='/icons/add-icon.svg'
                    width={30}
                    height={30}
                    alt='add icon'
                />
            }
        </div>
    )
}

export default AddButton;