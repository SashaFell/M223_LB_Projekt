import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Register from './Register';

describe('Register Form', () => {
    test('should show error messages for invalid registration', async () => {
        render(<Register />);

        // Mock API response for username already taken
        const mockResponse = {
            status: 409,
        };
        jest.spyOn(global, 'fetch').mockResolvedValueOnce({
            json: jest.fn().mockResolvedValueOnce(mockResponse),
        });

        // Fill out the form with invalid data
        const usernameInput = screen.getByLabelText(/username/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
        const roleInput = screen.getByLabelText(/role/i);
        const submitButton = screen.getByRole('button', { name: /sign up/i });

        fireEvent.change(usernameInput, { target: { value: 'existingUser' } });
        fireEvent.change(passwordInput, { target: { value: 'Test123!@#' } });
        fireEvent.change(confirmPasswordInput, { target: { value: 'Test123!@#' } });
        fireEvent.change(roleInput, { target: { value: 'Editor' } });

        fireEvent.click(submitButton);

        // Wait for error message
        await waitFor(() => {
            const errorMessage = screen.getByText(/username taken/i);
            expect(errorMessage).toBeInTheDocument();
        });

        // Check that the API was called with the correct data
        expect(global.fetch).toHaveBeenCalledWith('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user: 'existingUser',
                pwd: 'Test123!@#',
                role: 'Editor'
            }),
        });
    });
});
