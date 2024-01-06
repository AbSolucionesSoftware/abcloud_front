import React, { createContext } from 'react';

export const ComentariosCursoCtx = createContext();

export const ComentariosCursoProvider = ({ children }) => {
	const [reply, setReply] = React.useState({
        loading: true,
        error: undefined,
        data: undefined,
        hasNextPage: null,
        nextPage: null,
        page: 1,
        totalDocs: null,
      });

	return (
		<ComentariosCursoCtx.Provider
			value={{ reply, setReply }}
		>
			{children}
		</ComentariosCursoCtx.Provider>
	);
};
