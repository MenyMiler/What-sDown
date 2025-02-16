import i18next from 'i18next';
import React from 'react';
import { GridItemsWithGreyBackground } from '../GridItemsWithGreyBackground';
import { GridWithMultipleItems } from '../modals.styled';
import TextFieldElementForGender from './textFieldElementForGender';

const SoldierAmounts = () => {
    return (
        <GridWithMultipleItems container>
            <GridItemsWithGreyBackground fullWidth title={i18next.t('wizard.editSoldierAmountsInCourseRequest.soldierAmountsInCourse')}>
                <TextFieldElementForGender gender="MALE" />
                <TextFieldElementForGender gender="FEMALE" />
                <TextFieldElementForGender gender="OTHER_MALE" />
                <TextFieldElementForGender gender="OTHER_FEMALE" />
            </GridItemsWithGreyBackground>
        </GridWithMultipleItems>
    );
};

export default SoldierAmounts;
