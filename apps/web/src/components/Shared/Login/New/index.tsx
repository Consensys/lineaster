import useSimpleDebounce from '@components/utils/hooks/useSimpleDebounce';
import { PlusIcon } from '@heroicons/react/outline';
import { LensProfileCreator } from '@lenster/abis/LensProfileCreator';
import { IS_RELAYER_AVAILABLE, LENS_PROFILE_CREATOR, Regex } from '@lenster/data';
import { APP_NAME, ZERO_ADDRESS } from '@lenster/data/constants';
import { useCreateProfileMutation } from '@lenster/lens';
import getStampFyiURL from '@lenster/lib/getStampFyiURL';
import { Button, ErrorMessage, Form, Input, Spinner, useZodForm } from '@lenster/ui';
import { t, Trans } from '@lingui/macro';
import type { FC } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useAccount, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';
import { object, string } from 'zod';

import Pending from './Pending';

const newUserSchema = object({
  handle: string()
    .min(5, { message: t`Handle should be at least 5 characters` })
    .max(26, { message: t`Handle should not exceed 26 characters` })
    .regex(Regex.handle, {
      message: t`Handle should only contain alphanumeric characters`
    })
});

interface NewProfileProps {
  isModal?: boolean;
}

const NewProfile: FC<NewProfileProps> = ({ isModal = false }) => {
  const { address, isConnected } = useAccount();

  const [handle, setHandle] = useState('');
  const [createProfile, { data }] = useCreateProfileMutation();
  const [isCreationLoading, setIsCreationLoading] = useState(false);

  const avatar = useMemo(() => getStampFyiURL(address ?? ZERO_ADDRESS), [address]);

  const debouncedHandle = useSimpleDebounce(handle);

  const form = useZodForm({
    schema: newUserSchema
  });

  const { config, error: contractError } = usePrepareContractWrite({
    address: LENS_PROFILE_CREATOR,
    abi: LensProfileCreator,
    functionName: 'proxyCreateProfile',
    args: [
      {
        to: address,
        handle: debouncedHandle,
        imageURI: avatar,
        followModule: ZERO_ADDRESS,
        followModuleInitData: '0x',
        followNFTURI: ''
      }
    ],
    enabled: Boolean(debouncedHandle)
  });
  const { data: txData, write } = useContractWrite(config);

  const { isLoading, error } = useWaitForTransaction({
    hash: txData?.hash
  });

  const handleCreateProfile = async () => {
    write?.();
  };

  useEffect(() => {
    setIsCreationLoading(
      IS_RELAYER_AVAILABLE ? data?.createProfile.__typename === 'RelayerResult' : !!txData?.hash
    );
  }, [data, txData]);

  const handleContractError = (error: { message: string; data: { errorName: string } }) => {
    if (!error) {
      return 'Something is wrong with this handle, please try another one';
    }

    if (error.message.includes("Doesn't have an ENS token")) {
      return 'You need a Linea ENS domain before creating a Lineaster handle';
    } else if (error.message.includes('Already has a Lens handle')) {
      return 'You already have a Lineaster handle';
    } else if (error.data.errorName === 'HandleLengthInvalid') {
      return 'Handle length is invalid';
    } else if (error.data === '0x902815b9') {
      return 'This handle is already taken, please choose another one';
    } else if (error.data === '0x2edfc66c') {
      return 'This handle contains invalid characters, please choose another one';
    } else if (error.data === '0x5e58454e') {
      return 'This handle first character is invalid, please choose another one';
    } else if (error.data.errorName === 'NotWhitelisted') {
      return 'Profile creator not allowlisted';
    } else if (error.message.includes('The transaction sender must be')) {
      return error.message;
    }

    return `Error = ${error.data.errorName}`;
  };

  return isCreationLoading ? (
    <Pending
      handle={form.getValues('handle')}
      txHash={
        IS_RELAYER_AVAILABLE && data?.createProfile.__typename === 'RelayerResult'
          ? data?.createProfile?.txHash
          : txData?.hash
      }
    />
  ) : (
    <Form
      form={form}
      className="space-y-4"
      onSubmit={({ handle }) => {
        if (IS_RELAYER_AVAILABLE) {
          const username = handle.toLowerCase();
          createProfile({
            variables: {
              request: {
                handle: username,
                profilePictureUri: avatar
              }
            }
          });
        } else {
          handleCreateProfile();
        }
      }}
    >
      {data?.createProfile.__typename === 'RelayError' && (data?.createProfile.reason || error) && (
        <ErrorMessage
          className="mb-3"
          title="Create profile failed!"
          error={{
            name: 'Create profile failed!',
            message: IS_RELAYER_AVAILABLE ? data?.createProfile?.reason : error?.message || ''
          }}
        />
      )}
      {(contractError as any) && (
        <ErrorMessage
          className="mb-3"
          title="Unable to create your handle"
          error={{
            name: 'Create profile failed!',
            message: handleContractError((contractError as any).cause)
          }}
        />
      )}
      {isModal && (
        <div className="mb-2 space-y-4">
          <div className="text-xl font-medium text-white">
            <Trans>Sign up to {APP_NAME}</Trans>
          </div>
        </div>
      )}
      <Input
        label={t`Handle`}
        type="text"
        placeholder="gavin"
        {...form.register('handle', {
          onChange: (e) => setHandle(e.target.value)
        })}
      />
      <div className="space-y-1.5">
        <div className="font-medium text-white">Avatar</div>
        <div className="space-y-3">
          {avatar && (
            <div>
              <img className="h-60 w-60 rounded-lg" height={240} width={240} src={avatar} alt={avatar} />
            </div>
          )}
        </div>
      </div>
      <Button
        className="ml-auto rounded-full"
        type="submit"
        disabled={isLoading || !isConnected}
        icon={isLoading ? <Spinner size="xs" /> : <PlusIcon className="h-4 w-4" />}
      >
        <Trans>{isConnected ? 'Sign up' : 'Connect your wallet'}</Trans>
      </Button>
    </Form>
  );
};

export default NewProfile;
