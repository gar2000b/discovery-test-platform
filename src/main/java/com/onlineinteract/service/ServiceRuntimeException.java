package com.onlineinteract.service;

/**
 * This class extends java.lang.RuntimeException and is the base for all application runtime exceptions.
 * 
 * <p>
 * It add placeholder support for enhanced messages.
 * </p>
 * 
 * @author Gary Black
 * 
 */
public class ServiceRuntimeException extends RuntimeException {

    /**
     * Generated serialVersionUID.
     */
    private static final long serialVersionUID = -2692678742570926046L;

    /**
     * The Constant PARAM_PLACEHOLDER.
     */
    private static final String PARAM_PLACEHOLDER = "{}";

    /**
     * Optional parameters provided with this exception.
     */
    private Object[] parameters;

    /**
     * Construct a new ServiceRuntimeException.
     *
     * @param message the exception specific message
     * @param cause the predecessor in the chain
     * @param parameters optional parameters to message
     */
    public ServiceRuntimeException(final String message, final Throwable cause, final Object... parameters) {
        super(message, cause);
        this.parameters = parameters;
    }

    /**
     * Construct a new ServiceRuntimeException.
     *
     * @param cause the predecessor in the chain
     * @param parameters optional parameters
     */
    public ServiceRuntimeException(final Throwable cause, final Object... parameters) {
        this(null, cause, parameters);
    }

    /**
     * Construct a new ServiceRuntimeException.
     *
     * @param message the exception specific message
     * @param parameters optional parameters to message
     */
    public ServiceRuntimeException(final String message, final Object... parameters) {
        this(message, null, parameters);
    }

    /**
     * Get the optional parameters associated with this exception.
     *
     * @return the parameters
     */
    public final Object[] getParameters() {
        if (parameters == null) {
            return new Object[0];
        } else {
            return parameters;
        }
    }

    /*
     * (non-Javadoc)
     * 
     * @see java.lang.Throwable#getMessage()
     */
    public final String getMessage() {
        String message = super.getMessage();
        if (message == null) {
            message = super.getCause().getMessage();
        }
        if (message == null) {
            message = "";
        }

        if (parameters == null || parameters.length == 0) {
            return message;
        }

        int messageLength = message.length();
        StringBuilder sb = new StringBuilder(messageLength * 2);
        sb.append(message);
        for (Object obj : parameters) {

            int indexOfParamPlaceholder = sb.indexOf(PARAM_PLACEHOLDER);
            if (indexOfParamPlaceholder != -1) {
                if (obj == null) {
                    sb.replace(indexOfParamPlaceholder, indexOfParamPlaceholder + 2, "{null}");
                } else {
                    sb.replace(indexOfParamPlaceholder, indexOfParamPlaceholder + 2, obj.toString());
                }

            }
        }

        return sb.toString();
    }
}
