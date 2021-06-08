package com.onlineinteract.exception;

/**
 * Thrown when a bad request (400) is encountered.
 * 
 * @author 316746874
 * 
 */
public class BadRequestException extends AppRuntimeException {

    private static final long serialVersionUID = -3592086436327278775L;

    /**
     * Construct a new BadRequestException.
     *
     * @param cause the predecessor in the chain
     * @param parameters optional parameters
     */
    public BadRequestException(Throwable cause, Object... parameters) {
        super(cause, parameters);
    }

    /**
     * Construct a new BadRequestException.
     *
     * @param message the exception specific message
     * @param parameters optional parameters to message
     */
    public BadRequestException(String message, Object... parameters) {
        super(message, parameters);
    }

    /**
     * Construct a new BadRequestException.
     *
     * @param message the exception specific message
     * @param cause the predecessor in the chain
     * @param parameters optional parameters to message
     */
    public BadRequestException(String message, Throwable cause, Object... parameters) {
        super(message, cause, parameters);
    }
}
