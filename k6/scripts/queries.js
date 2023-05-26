export const exploreFeedQuery = {
  operationName: 'ExploreFeed',
  variables: {
    request: {
      sortCriteria: 'CURATED_PROFILES',
      noRandomize: false,
      customFilters: ['GARDENERS'],
      metadata: null,
      limit: 10
    },
    reactionRequest: null,
    profileId: null
  },
  query:
    'query ExploreFeed($request: ExplorePublicationRequest!, $reactionRequest: ReactionFieldResolverRequest, $profileId: ProfileId) {\n  explorePublications(request: $request) {\n    items {\n      ... on Post {\n        ...PostFields\n        __typename\n      }\n      ... on Comment {\n        ...CommentFields\n        __typename\n      }\n      ... on Mirror {\n        ...MirrorFields\n        __typename\n      }\n      __typename\n    }\n    pageInfo {\n      next\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment PostFields on Post {\n  id\n  profile {\n    ...ProfileFields\n    __typename\n  }\n  reaction(request: $reactionRequest)\n  mirrors(by: $profileId)\n  hasCollectedByMe\n  onChainContentURI\n  isGated\n  isDataAvailability\n  dataAvailabilityProofs\n  canComment(profileId: $profileId) {\n    result\n    __typename\n  }\n  canMirror(profileId: $profileId) {\n    result\n    __typename\n  }\n  canDecrypt(profileId: $profileId) {\n    result\n    reasons\n    __typename\n  }\n  collectModule {\n    ...CollectModuleFields\n    __typename\n  }\n  stats {\n    ...StatsFields\n    __typename\n  }\n  metadata {\n    ...MetadataFields\n    __typename\n  }\n  hidden\n  createdAt\n  appId\n  __typename\n}\n\nfragment ProfileFields on Profile {\n  id\n  name\n  handle\n  bio\n  ownedBy\n  isFollowedByMe\n  stats {\n    totalFollowers\n    totalFollowing\n    __typename\n  }\n  attributes {\n    key\n    value\n    __typename\n  }\n  picture {\n    ... on MediaSet {\n      original {\n        url\n        __typename\n      }\n      __typename\n    }\n    ... on NftImage {\n      uri\n      __typename\n    }\n    __typename\n  }\n  followModule {\n    __typename\n  }\n  __typename\n}\n\nfragment CollectModuleFields on CollectModule {\n  ... on FreeCollectModuleSettings {\n    type\n    contractAddress\n    followerOnly\n    __typename\n  }\n  ... on FeeCollectModuleSettings {\n    type\n    referralFee\n    contractAddress\n    followerOnly\n    amount {\n      ...ModuleFeeAmountFields\n      __typename\n    }\n    __typename\n  }\n  ... on LimitedFeeCollectModuleSettings {\n    type\n    collectLimit\n    referralFee\n    contractAddress\n    followerOnly\n    amount {\n      ...ModuleFeeAmountFields\n      __typename\n    }\n    __typename\n  }\n  ... on LimitedTimedFeeCollectModuleSettings {\n    type\n    collectLimit\n    endTimestamp\n    referralFee\n    contractAddress\n    followerOnly\n    amount {\n      ...ModuleFeeAmountFields\n      __typename\n    }\n    __typename\n  }\n  ... on TimedFeeCollectModuleSettings {\n    type\n    endTimestamp\n    referralFee\n    contractAddress\n    followerOnly\n    amount {\n      ...ModuleFeeAmountFields\n      __typename\n    }\n    __typename\n  }\n  ... on MultirecipientFeeCollectModuleSettings {\n    type\n    optionalCollectLimit: collectLimit\n    optionalEndTimestamp: endTimestamp\n    referralFee\n    followerOnly\n    contractAddress\n    amount {\n      ...ModuleFeeAmountFields\n      __typename\n    }\n    recipients {\n      recipient\n      split\n      __typename\n    }\n    __typename\n  }\n  ... on SimpleCollectModuleSettings {\n    type\n    optionalCollectLimit: collectLimit\n    optionalEndTimestamp: endTimestamp\n    contractAddress\n    followerOnly\n    fee {\n      amount {\n        ...ModuleFeeAmountFields\n        __typename\n      }\n      recipient\n      referralFee\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment ModuleFeeAmountFields on ModuleFeeAmount {\n  asset {\n    symbol\n    decimals\n    address\n    __typename\n  }\n  value\n  __typename\n}\n\nfragment StatsFields on PublicationStats {\n  totalUpvotes\n  totalAmountOfMirrors\n  totalAmountOfCollects\n  totalAmountOfComments\n  __typename\n}\n\nfragment MetadataFields on MetadataOutput {\n  name\n  content\n  image\n  attributes {\n    traitType\n    value\n    __typename\n  }\n  cover {\n    original {\n      url\n      __typename\n    }\n    __typename\n  }\n  media {\n    original {\n      url\n      mimeType\n      __typename\n    }\n    __typename\n  }\n  encryptionParams {\n    accessCondition {\n      or {\n        criteria {\n          ...SimpleConditionFields\n          and {\n            criteria {\n              ...SimpleConditionFields\n              __typename\n            }\n            __typename\n          }\n          or {\n            criteria {\n              ...SimpleConditionFields\n              __typename\n            }\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment SimpleConditionFields on AccessConditionOutput {\n  nft {\n    contractAddress\n    chainID\n    contractType\n    tokenIds\n    __typename\n  }\n  eoa {\n    address\n    __typename\n  }\n  token {\n    contractAddress\n    amount\n    chainID\n    condition\n    decimals\n    __typename\n  }\n  follow {\n    profileId\n    __typename\n  }\n  collect {\n    publicationId\n    thisPublication\n    __typename\n  }\n  __typename\n}\n\nfragment CommentFields on Comment {\n  id\n  profile {\n    ...ProfileFields\n    __typename\n  }\n  reaction(request: $reactionRequest)\n  mirrors(by: $profileId)\n  hasCollectedByMe\n  onChainContentURI\n  isGated\n  isDataAvailability\n  dataAvailabilityProofs\n  canComment(profileId: $profileId) {\n    result\n    __typename\n  }\n  canMirror(profileId: $profileId) {\n    result\n    __typename\n  }\n  canDecrypt(profileId: $profileId) {\n    result\n    reasons\n    __typename\n  }\n  collectModule {\n    ...CollectModuleFields\n    __typename\n  }\n  stats {\n    ...StatsFields\n    __typename\n  }\n  metadata {\n    ...MetadataFields\n    __typename\n  }\n  hidden\n  createdAt\n  appId\n  commentOn {\n    ... on Post {\n      ...PostFields\n      __typename\n    }\n    ... on Comment {\n      id\n      profile {\n        ...ProfileFields\n        __typename\n      }\n      reaction(request: $reactionRequest)\n      mirrors(by: $profileId)\n      hasCollectedByMe\n      onChainContentURI\n      isGated\n      isDataAvailability\n      dataAvailabilityProofs\n      canComment(profileId: $profileId) {\n        result\n        __typename\n      }\n      canMirror(profileId: $profileId) {\n        result\n        __typename\n      }\n      canDecrypt(profileId: $profileId) {\n        result\n        reasons\n        __typename\n      }\n      collectModule {\n        ...CollectModuleFields\n        __typename\n      }\n      metadata {\n        ...MetadataFields\n        __typename\n      }\n      stats {\n        ...StatsFields\n        __typename\n      }\n      mainPost {\n        ... on Post {\n          ...PostFields\n          __typename\n        }\n        ... on Mirror {\n          ...MirrorFields\n          __typename\n        }\n        __typename\n      }\n      hidden\n      createdAt\n      __typename\n    }\n    ... on Mirror {\n      ...MirrorFields\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment MirrorFields on Mirror {\n  id\n  profile {\n    ...ProfileFields\n    __typename\n  }\n  reaction(request: $reactionRequest)\n  hasCollectedByMe\n  isGated\n  isDataAvailability\n  dataAvailabilityProofs\n  canComment(profileId: $profileId) {\n    result\n    __typename\n  }\n  canMirror(profileId: $profileId) {\n    result\n    __typename\n  }\n  canDecrypt(profileId: $profileId) {\n    result\n    reasons\n    __typename\n  }\n  collectModule {\n    ...CollectModuleFields\n    __typename\n  }\n  stats {\n    ...StatsFields\n    __typename\n  }\n  metadata {\n    ...MetadataFields\n    __typename\n  }\n  hidden\n  mirrorOf {\n    ... on Post {\n      ...PostFields\n      __typename\n    }\n    ... on Comment {\n      id\n      profile {\n        ...ProfileFields\n        __typename\n      }\n      collectNftAddress\n      reaction(request: $reactionRequest)\n      mirrors(by: $profileId)\n      onChainContentURI\n      isGated\n      isDataAvailability\n      dataAvailabilityProofs\n      canComment(profileId: $profileId) {\n        result\n        __typename\n      }\n      canMirror(profileId: $profileId) {\n        result\n        __typename\n      }\n      canDecrypt(profileId: $profileId) {\n        result\n        reasons\n        __typename\n      }\n      stats {\n        ...StatsFields\n        __typename\n      }\n      createdAt\n      __typename\n    }\n    __typename\n  }\n  createdAt\n  appId\n  __typename\n}'
};
