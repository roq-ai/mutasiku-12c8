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

import { createAccountBalance } from 'apiSdk/account-balances';
import { accountBalanceValidationSchema } from 'validationSchema/account-balances';
import { BankAccountInterface } from 'interfaces/bank-account';
import { getBankAccounts } from 'apiSdk/bank-accounts';
import { AccountBalanceInterface } from 'interfaces/account-balance';

function AccountBalanceCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: AccountBalanceInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createAccountBalance(values);
      resetForm();
      router.push('/account-balances');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<AccountBalanceInterface>({
    initialValues: {
      balance: 0,
      balance_date: new Date(new Date().toDateString()),
      bank_account_id: (router.query.bank_account_id as string) ?? null,
    },
    validationSchema: accountBalanceValidationSchema,
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
              label: 'Account Balances',
              link: '/account-balances',
            },
            {
              label: 'Create Account Balance',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Create Account Balance
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <FormWrapper onSubmit={formik.handleSubmit}>
          <NumberInput
            label="Balance"
            formControlProps={{
              id: 'balance',
              isInvalid: !!formik.errors?.balance,
            }}
            name="balance"
            error={formik.errors?.balance}
            value={formik.values?.balance}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('balance', Number.isNaN(valueNumber) ? 0 : valueNumber)
            }
          />

          <FormControl id="balance_date" mb="4">
            <FormLabel fontSize="1rem" fontWeight={600}>
              Balance Date
            </FormLabel>
            <DatePicker
              selected={formik.values?.balance_date ? new Date(formik.values?.balance_date) : null}
              onChange={(value: Date) => formik.setFieldValue('balance_date', value)}
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
              onClick={() => router.push('/account-balances')}
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
    entity: 'account_balance',
    operation: AccessOperationEnum.CREATE,
  }),
)(AccountBalanceCreatePage);
