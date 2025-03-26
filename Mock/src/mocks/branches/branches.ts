import { config } from '../../config';
import { BranchDocument } from '../../interfaces/branch';
import { axios } from '../../utils/axios';

const { uri, baseRoute } = config.branches;

const branchNames = ['מוד"ש', 'סייבר', '980', '950'];

export const getBranches = async () => {
    const { data } = await axios.get<BranchDocument[]>(uri + baseRoute, { params: config.getManyParams });
    return data;
};

const createBranch = async (name: string) => {
    const { data } = await axios.post<BranchDocument>(uri + baseRoute, { name });
    return data;
};

export const createBranches = async () => {
    return Promise.all(branchNames.map(createBranch));
};
