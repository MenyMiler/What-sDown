import { FeaturesManager } from '../express/features/manager.js';

export const seed = async () => {
    const currFeatures = await FeaturesManager.getByQuery({}, 100);
    if (currFeatures.length === 0) {
        const features = ['feature1', 'feature2', 'feature3', 'feature4', 'feature5', 'feature6'].map((name, index) => ({ name, status: index < 3 }));
        return await FeaturesManager.createMany(features);
    }
    return currFeatures;
};
