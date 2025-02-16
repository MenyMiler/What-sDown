import * as React from 'react';
import _ from 'lodash';
import { useParams } from 'react-router';
import { FormContainer } from 'react-hook-form-mui';
import EditSoldiers from '../../common/editSoldiers';
import { SoldierTypes } from '../../interfaces/soldier';

const HumanResourcesBySoldierType = ({ soldierType }: { soldierType: SoldierTypes }) => {
    return (
        <FormContainer>
            <EditSoldiers key={soldierType} soldierType={soldierType} />
        </FormContainer>
    );
};

const HumanResources = () => {
    const { soldierType } = useParams();

    return <HumanResourcesBySoldierType key={soldierType} soldierType={soldierType?.toUpperCase() as SoldierTypes} />;
};

export default HumanResources;
