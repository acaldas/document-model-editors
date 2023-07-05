import React, { CSSProperties, useEffect } from "react";
import TextInput from "./components/textInput";
import { ColorTheme, colorScheme, typographySizes } from "./styles";
import useDocumentModelReducer from "./reducer";
import { actions } from '@acaldas/document-model-libs/browser/document-model';

interface EditorProps {
    mode? : ColorTheme,
    debug? : boolean
}

interface Entry {
    id: string,
    value: string
}

function Editor(props: EditorProps) {
    const theme: ColorTheme = props.mode || 'light';
    const scheme = colorScheme[theme];
    const style: CSSProperties = {
        backgroundColor: scheme.bgColor, 
        color: scheme.color, 
        maxWidth: "60em", 
        margin:"1em auto",
        padding:"6em",
        border: "2px solid " + scheme.border,
        boxShadow: "2px 2px 2px " + scheme.shadow,
        fontFamily: "Roboto, sans-serif",
        position: 'relative'
    };

    const [state, dispatch, reset] = useDocumentModelReducer();

    useEffect(() => {
        if (state.operations.length < 1) {
            dispatch(actions.setModelId({id:''}));
        }
    });

    const setModelId = (id:string) => {
        dispatch(actions.setModelId({id}));
    }

    const setModelExtension = (extension:string) => {
        dispatch(actions.setModelExtension({extension}));
    }

    const setModelName = (name:string) => {
        dispatch(actions.setModelName({name}));
    }

    const setAuthorName = (authorName:string) => {
        dispatch(actions.setAuthorName({authorName}));
    }

    const setAuthorWebsite = (authorWebsite:string) => {
        dispatch(actions.setAuthorWebsite({authorWebsite}));
    }
    
    const addModule = (name:string) => {
        dispatch(actions.addModule({name}));
    }

    const updateModuleName = (id: string, name:string) => {
        dispatch(actions.setModuleName({id, name}));
    }

    const updateModuleDescription = (id: string, description:string) => {
        dispatch(actions.setModuleDescription({id, description}));
    }

    const deleteModule = (id:string) => {
        dispatch(actions.deleteModule({id}));
    }

    const addOperation = (moduleId:string, name: string) => {
        dispatch(actions.addOperation({moduleId, name}));
    }

    const updateOperationName = (id: string, name: string) => {
        dispatch(actions.setOperationName({id, name}))
    }

    const deleteOperation = (id: string) => {
        dispatch(actions.deleteOperation({id}))
    }

    return (
        <>
            <div style={style}>
                <TextInput 
                    key="modelName"
                    theme={theme} 
                    value={state.data.name}
                    placeholder="Document Model Name" 
                    autoFocus={true}
                    onSubmit={setModelName}
                    clearOnSubmit={false}
                    size="larger"
                />
                <div style={{width: '50%', display:'inline-block'}}>
                    <TextInput 
                        key="modelId"
                        theme={theme} 
                        value={state.data.id}
                        placeholder="Model Type" 
                        autoFocus={false}
                        onSubmit={setModelId}
                        clearOnSubmit={false}
                        size="small"
                    />
                </div>
                <div style={{width: '50%', display:'inline-block'}}>
                    <TextInput 
                        key="modelExtension"
                        theme={theme} 
                        value={state.data.extension}
                        placeholder="File Extension(s)" 
                        autoFocus={false}
                        onSubmit={setModelExtension}
                        clearOnSubmit={false}
                        size="small"
                    />
                </div>
                <div>
                    <p style={{...typographySizes.tiny}}>Author</p>
                    <div style={{width: '50%', display:'inline-block'}}>
                        <TextInput 
                            key="authorName"
                            theme={theme} 
                            value={state.data.author.name}
                            placeholder="Author Name" 
                            autoFocus={false}
                            onSubmit={setAuthorName}
                            clearOnSubmit={false}
                            size="small"
                        />
                    </div>
                    <div style={{width: '50%', display:'inline-block'}}>
                        <TextInput 
                            key="authorWebsite"
                            theme={theme} 
                            value={state.data.author.website || ''}
                            placeholder="https://" 
                            autoFocus={false}
                            onSubmit={setAuthorWebsite}
                            clearOnSubmit={false}
                            size="small"
                        />
                    </div>
                </div>
                {
                    state.data.modules.map(m => <div key={m.id}>
                        <TextInput 
                            key={m.id + '#name'}
                            theme={theme}
                            placeholder="Module Name" 
                            autoFocus={false}
                            onSubmit={(name) => updateModuleName(m.id, name)}
                            onEmpty={() => deleteModule(m.id)}
                            value={m.name}
                            clearOnSubmit={false}
                            size="large"
                            horizontalLine={true}
                        />
                        <TextInput 
                            key={m.id + '#description'}
                            theme={theme}
                            placeholder={'Module ' + m.name + ' description'} 
                            autoFocus={false}
                            onSubmit={(description) => updateModuleDescription(m.id, description)}
                            value={m.description || ''}
                            clearOnSubmit={false}
                            size="small"
                        />
                        {m.operations.map(op => 
                            <div key={op.id}>
                                <TextInput 
                                    key={op.id + '#name'}
                                    theme={theme} 
                                    autoFocus={false}
                                    onSubmit={(name) => updateOperationName(op.id, name)}
                                    onEmpty={() => deleteOperation(op.id)}
                                    value={op.name || ''}
                                    clearOnSubmit={false}
                                    size="medium"
                                />
                            </div>
                        )}
                        <TextInput 
                            key={m.id + '#newOperation'}
                            theme={theme} 
                            autoFocus={false}
                            placeholder="Add operation..."
                            onSubmit={(name) => addOperation(m.id, name)}
                            clearOnSubmit={true}
                            size="medium"
                        />
                    </div>)
                }
                <TextInput 
                    key="newModule"
                    theme={theme}
                    placeholder="Module Name" 
                    autoFocus={false}
                    onSubmit={addModule}
                    clearOnSubmit={true}
                    size="large"
                    horizontalLine={true}
                />
            </div>
            { props.debug ?
                <code 
                    key='stateView' 
                    style={{
                        ...style, 
                        maxWidth: '60em', 
                        margin: '4em auto', 
                        maxHeight: '25em', 
                        overflowY: 'scroll', 
                        display: 'block', 
                        whiteSpace: 'pre-wrap',
                        fontFamily: 'monospace',
                        lineHeight: '1.7'
                    }}>{JSON.stringify(state, null, 2)}</code>
                : '' 
            }
        </>
    );
}

export default Editor;