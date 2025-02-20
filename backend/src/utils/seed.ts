import { FeaturesService } from '../express/features/service';

export const seed = async () => {
    //to create 6 features 3 with status true and 3 with status false if the features collection is empty
    const currFeatures = await FeaturesService.getByQuery({});
    if (currFeatures.length === 0) {
        const features = ['feature1', 'feature2', 'feature3', 'feature4', 'feature5', 'feature6'].map((name, index) => ({ name, status: index < 3 }));
        return await FeaturesService.createMany(features);
    }
    return currFeatures;
};
