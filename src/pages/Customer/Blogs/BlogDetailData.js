import { useQuery, useQueryClient } from "react-query";

const useBlogDetailQuery = (blogDetailUrl) => {
    const queryClient = useQueryClient();

    return useQuery("get-detail-blog", () =>
        fetch(blogDetailUrl, {}).then((response) => response.json())
    );
};

export default useBlogDetailQuery;
