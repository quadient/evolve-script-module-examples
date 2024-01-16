export interface MetaContext {
    totalPages: number;
    groups: Group[];
}

export interface Group {
    group: { [key: string]: string };
    pageCount: number;
    pageSizes: number[][];
    pageNumbers: number[];
}

export interface PageSizes {
    pageCount: number;
    sizes: number[][];
}

export interface Metadata {
    groupSizes: number[];
    pageSizes: (number | number[])[];
    groups: { [key: string]: string }[];
}

export function createMetaContext(metadataJson: Metadata): MetaContext {
    const pageSizes = loadPageSizeObj(metadataJson);
    const metaContext: MetaContext = {
        totalPages: pageSizes.pageCount,
        groups: [],
    };
    let totalPageCounter = 0;
    for (let i = 0; i < metadataJson.groups.length; i++) {
        const group = metadataJson.groups[i];
        const pageCount = metadataJson.groupSizes[i];

        const groupInfo: Group = {
            group,
            pageCount,
            pageSizes: [],
            pageNumbers: [],
        };

        for (let i = totalPageCounter; i < totalPageCounter + pageCount; i++) {
            groupInfo.pageSizes.push(pageSizes.sizes[i]);
            groupInfo.pageNumbers.push(i + 1);
        }
        metaContext.groups.push(groupInfo);

        totalPageCounter = totalPageCounter + pageCount;
    }

    return metaContext;
}

function loadPageSizeObj(metadataJson: Metadata): PageSizes {
    let pageCount = 0;
    let sizes: Array<any> = [];
    for (
        let index = 0;
        index < metadataJson.pageSizes.length;
        index = index + 2
    ) {
        const count = metadataJson.pageSizes[index];
        if (Array.isArray(count)) {
            throw new Error('Could not read metadata.');
        }
        const size = metadataJson.pageSizes[index + 1];
        if (!Array.isArray(size)) {
            throw new Error('Could not read metadata.');
        }
        for (
            let pageIndex = pageCount;
            pageIndex < pageCount + count;
            pageIndex++
        ) {
            sizes.push(size);
        }
        pageCount = pageCount + count;
    }
    return {
        pageCount: pageCount,
        sizes: sizes,
    };
}
