import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Register from './Register';

describe('Register Form', () => {
    test('should register a new user successfully', async () => {
        render(<Register />);

        // Mock API response for successful registration
        const mockResponse = {
            status: 201,
            data: { success: 'New user testUser created!' }
        };
        jest.spyOn(global, 'fetch').mockResolvedValueOnce({
            json: jest.fn().mockResolvedValueOnce(mockResponse),
        });

        // Fill out the form
        const usernameInput = screen.getByLabelText(/username/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
        const roleInput = screen.getByLabelText(/role/i);
        const submitButton = screen.getByRole('button', { name: /sign up/i });

        fireEvent.change(usernameInput, { target: { value: 'testUser' } });
        fireEvent.change(passwordInput, { target: { value: 'Test123!@#' } });
        fireEvent.change(confirmPasswordInput, { target: { value: 'Test123!@#' } });
        fireEvent.change(roleInput, { target: { value: 'Admin' } });

        fireEvent.click(submitButton);

        // Wait for success message
        await waitFor(() => {
            const successMessage = screen.getByText(/success/i);
            expect(successMessage).toBeInTheDocument();
        });

        // Check that the API was called with the correct data
        expect(global.fetch).toHaveBeenCalledWith('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user: 'testUser',
                pwd: 'Test123!@#',
                role: 'Admin'
            }),
        });
    });
});
