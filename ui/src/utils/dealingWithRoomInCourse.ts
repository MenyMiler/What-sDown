import { RoomTypes, RoomWithSoldiers } from '../interfaces/room';
import { Genders } from '../interfaces/soldier';

export const iterateOverRoomsForAmountOfSoldiers = (
    rooms: RoomWithSoldiers[],
    selectedType?: RoomTypes,
    selectedGender?: Genders,
    selectedIsStaffOption = false,
) => {
    return rooms
        .filter(
            ({ type, gender, isStaff }) =>
                selectedType && type === selectedType && selectedGender && gender === selectedGender && isStaff === selectedIsStaffOption,
        )
        .reduce((acc, room) => room.soldiers.length + acc, 0)
        .toString();
};
