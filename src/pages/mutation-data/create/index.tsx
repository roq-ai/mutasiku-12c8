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
import { FunctionComponent, useState } from 'react';
import * as yup from 'yup';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';

import { createMutationData } from 'apiSdk/mutation-data';
import { mutationDataValidationSchema } from 'validationSchema/mutation-data';
import { BankAccountInterface } from 'interfaces/bank-account';
import { getBankAccounts } from 'apiSdk/bank-accounts';
import { MutationDataInterface } from 'interfaces/mutation-data';

function MutationDataCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: MutationDataInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createMutationData(values);
      resetForm();
      router.push('/mutation-data');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<MutationDataInterface>({
    initialValues: {
      transaction_id: '',
      transaction_amount: 0,
      transaction_date: new Date(new Date().toDateString()),
      bank_account_id: (router.query.bank_account_id as string) ?? null,
    },
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
              label: 'Create Mutation Data',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Create Mutation Data
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
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
    operation: AccessOperationEnum.CREATE,
  }),
)(MutationDataCreatePage);
