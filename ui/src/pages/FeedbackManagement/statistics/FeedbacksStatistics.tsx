import React, { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import { StatisticCube } from './StatisticCube';
import { FeedbacksService } from '../../../services/feedbacks';

export interface IPercentageByRating {
    rating: number;
    percentage: number;
    count: number;
}

export interface IFrequentCategory {
    category: string;
    count: number;
}

const ratingsArray = [1, 2, 3, 4, 5];

export const FeedbacksStatistics = () => {
    const [percentageByRating, setPercentageByRating] = useState<IPercentageByRating[]>([]);
    const [frequentCategory, setFrequentCategory] = useState<IFrequentCategory>();
    const [totalAmountOfFeedbacks, setTotalAmountOfFeedbacks] = useState<number>(0);

    useEffect(() => {
        async function getRatingAndTheirPercentage() {
            const data = await FeedbacksService.getPercentageByRating();

            setPercentageByRating(
                ratingsArray.map((rating) => {
                    const ratingByPercentage = data.find(({ _id }) => _id === rating);

                    if (!ratingByPercentage)
                        return {
                            rating,
                            count: 0,
                            percentage: 0,
                        };

                    setTotalAmountOfFeedbacks((curr) => curr + ratingByPercentage.count);
                    return {
                        rating: ratingByPercentage._id,
                        count: ratingByPercentage.count,
                        percentage: ratingByPercentage.percentage,
                    };
                }),
            );
        }

        async function getFrequentCategory() {
            const { _id, count } = await FeedbacksService.getFrequentCategory();
            setFrequentCategory({ category: _id, count });
        }
        getRatingAndTheirPercentage();
        getFrequentCategory();
    }, []);

    return (
        <Grid item container spacing={3} direction="row" alignItems="center" sx={{ ml: '-17px' }}>
            <Grid item>
                <StatisticCube
                    moreDetails
                    percentageByRating={percentageByRating}
                    title="overallSatisfaction"
                    totalAmountOfFeedbacks={totalAmountOfFeedbacks}
                />
            </Grid>
            <Grid item>
                <StatisticCube title="frequentCategory" frequentCategory={frequentCategory} totalAmountOfFeedbacks={totalAmountOfFeedbacks} />
            </Grid>
        </Grid>
    );
};
