import React from 'react';
import { render, fireEvent, wait, act } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import ForgotPassword from '../../pages/ForgotPassword';
import api from '../../services/api';

const apiMock = new MockAdapter(api);

const mockedHistoryPush = jest.fn();
const mockedAddToast = jest.fn();

jest.mock('react-router-dom', () => {
  return {
    useHistory: () => ({
      push: mockedHistoryPush,
    }),
    Link: ({ children }: { children: React.ReactNode }) => children,
  };
});

jest.mock('../../hooks/toast', () => {
  return {
    useToast: () => ({
      addToast: mockedAddToast,
    }),
  };
});

describe('ForgotPassword Page', () => {
  beforeEach(() => {
    mockedHistoryPush.mockClear();
    mockedAddToast.mockClear();
  });

  it('should be able to recover the password', async () => {
    const { getByPlaceholderText, getByText } = render(<ForgotPassword />);

    const email = getByPlaceholderText('E-mail');

    fireEvent.change(email, { target: { value: 'johndoe@example.com.br' } });

    apiMock.onPost('/password/forgot').reply(204, {});

    fireEvent.click(getByText('Recuperar'));

    await wait(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'success',
        }),
      );
    });
  });

  it('should not be able to recover the password from an invalid e-mail', async () => {
    const { getByPlaceholderText, getByText } = render(<ForgotPassword />);

    const email = getByPlaceholderText('E-mail');

    fireEvent.change(email, { target: { value: 'invalid-email' } });

    apiMock.onPost('/password/forgot').reply(204, {});

    fireEvent.click(getByText('Recuperar'));

    await wait(() => {
      expect(mockedAddToast).not.toHaveBeenCalled();
    });
  });

  it('should display a toast if recover password failed', async () => {
    const { getByPlaceholderText, getByText } = render(<ForgotPassword />);

    const email = getByPlaceholderText('E-mail');

    fireEvent.change(email, { target: { value: 'johndoe@example.com.br' } });

    apiMock.onPost('/password/forgot').reply(401, {});

    fireEvent.click(getByText('Recuperar'));

    await wait(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
        }),
      );
    });
  });
});
