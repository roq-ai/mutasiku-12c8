import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  Flex,
  Center,
} from '@chakra-ui/react';
import Breadcrumbs from 'components/breadcrumb';
import DatePicker from 'components/date-picker';
import { Error } from 'components/error';
import { FormWrapper } from 'components/form-wrapper';
import { NumberInput } from 'components/number-input';
import { SelectInput } from 'components/select-input';
import { AsyncSelect } from 'components/async-select';
import { TextInput } from 'components/text-input';
import AppLayout from 'layout/app-layout';
import { FormikHelpers, useFormik } from 'formik';
import { useRouter } from 'next/router';
import { FunctionComponent, useState, useRef } from 'react';
import * as yup from 'yup';
import useSWR from 'swr';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { ImagePicker } from 'components/image-file-picker';
import { getMutationDataById, updateMutationDataById } from 'apiSdk/mutation-data';
import { mutationDataValidationSchema } from 'validationSchema/mutation-data';
import { MutationDataInterface } from 'interfaces/mutation-data';
import { BankAccountInterface } from 'interfaces/bank-account';
import { getBankAccounts } from 'apiSdk/bank-accounts';

function MutationDataEditPage() {
  const router = useRouter();
  const id = router.query.id as string;

  const { data, error, isLoading, mutate } = useSWR<MutationDataInterface>(
    () => (id ? `/mutation-data/${id}` : null),
    () => getMutationDataById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: MutationDataInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateMutationDataById(id, values);
      mutate(updated);
      resetForm();
      router.push('/mutation-data');
    } catch (error: any) {
      if (error?.response.status === 403) {
        setFormError({ message: "You don't have permisisons to update this resource" });
      } else {
        setFormError(error);
      }
    }
  };

  const formik = useFormik<MutationDataInterface>({
    initialValues: data,
    validationSchema: mutationDataValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout
      breadcrumbs={
        <Breadcrumbs
          items={[
            {
              label: 'Mutation Data',
              link: '/mutation-data',
            },
            {
              label: 'Update Mutation Data',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Update Mutation Data
          </Text>
        </Box>
        {(error || formError) && (
          <Box mb={4}>
            <Error error={error || formError} />
          </Box>
        )}

        <FormWrapper onSubmit={formik.handleSubmit}>
          <TextInput
            error={formik.errors.transaction_id}
            label={'Transaction Id'}
            props={{
              name: 'transaction_id',
              placeholder: 'Transaction Id',
              value: formik.values?.transaction_id,
              onChange: formik.handleChange,
            }}
          />

          <NumberInput
            label="Transaction Amount"
            formControlProps={{
              id: 'transaction_amount',
              isInvalid: !!formik.errors?.transaction_amount,
            }}
            name="transaction_amount"
            error={formik.errors?.transaction_amount}
            value={formik.values?.transaction_amount}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('transaction_amount', Number.isNaN(valueNumber) ? 0 : valueNumber)
            }
          />

          <FormControl id="transaction_date" mb="4">
            <FormLabel fontSize="1rem" fontWeight={600}>
              Transaction Date
            </FormLabel>
            <DatePicker
              selected={formik.values?.transaction_date ? new Date(formik.values?.transaction_date) : null}
              onChange={(value: Date) => formik.setFieldValue('transaction_date', value)}
            />
          </FormControl>
          <AsyncSelect<BankAccountInterface>
            formik={formik}
            name={'bank_account_id'}
            label={'Select Bank Account'}
            placeholder={'Select Bank Account'}
            fetcher={getBankAccounts}
            labelField={'bank_name'}
          />
          <Flex justifyContent={'flex-start'}>
            <Button
              isDisabled={formik?.isSubmitting}
              bg="state.info.main"
              color="base.100"
              type="submit"
              display="flex"
              height="2.5rem"
              padding="0rem 1rem"
              justifyContent="center"
              alignItems="center"
              gap="0.5rem"
              mr="4"
              _hover={{
                bg: 'state.info.main',
                color: 'base.100',
              }}
            >
              Submit
            </Button>
            <Button
              bg="neutral.transparent"
              color="neutral.main"
              type="button"
              display="flex"
              height="2.5rem"
              padding="0rem 1rem"
              justifyContent="center"
              alignItems="center"
              gap="0.5rem"
              mr="4"
              onClick={() => router.push('/mutation-data')}
              _hover={{
                bg: 'neutral.transparent',
                color: 'neutral.main',
              }}
            >
              Cancel
            </Button>
          </Flex>
        </FormWrapper>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'mutation_data',
    operation: AccessOperationEnum.UPDATE,
  }),
)(MutationDataEditPage);
