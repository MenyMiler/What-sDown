import i18next from 'i18next';
import React from 'react';
import { GridItemsWithGreyBackground } from '../GridItemsWithGreyBackground';
import { GridWithMultipleItems } from '../modals.styled';
import TextFieldElementForGender from './textFieldElementForGender';

const SpecialSoldierAmounts = () => {
    return (
        <GridWithMultipleItems container>
            <GridItemsWithGreyBackground fullWidth title={i18next.t('wizard.editSoldierAmountsInCourseRequest.specialSoldierAmountsInCourse')}>
                <TextFieldElementForGender gender="SPECIAL_MALE" />
                <TextFieldElementForGender gender="SPECIAL_FEMALE" />
                <TextFieldElementForGender gender="SPECIAL_OTHER_MALE" />
                <TextFieldElementForGender gender="SPECIAL_OTHER_FEMALE" />
            </GridItemsWithGreyBackground>
        </GridWithMultipleItems>
    );
};

export default SpecialSoldierAmounts;
