import React, { useState } from 'react'
import Editor, { loader } from '@monaco-editor/react'
import JsonToTS from 'json-to-ts'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { message, Button, FloatButton, Drawer, Space, Select, Typography } from 'antd'
import { DeleteFilled, CopyFilled, SettingOutlined, GithubOutlined } from './icons'

loader.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.33.0/min/vs' } })

const { Link } = Typography

function App() {
  const [value, setValue] = useState('')
  const [output, setOutput] = useState('')
  const [open, setOpen] = useState(false)
  const [theme, setTheme] = useState(localStorage.getItem('theme') ?? 'light')

  const handleSubmit = () => {
    const output = JsonToTS(JSON.parse(value))
      .reduce((type1, type2) => {
        return `${type1}\n\n${type2}`
      })
      .trim()
    setOutput(output)
  }
  const showDrawer = () => {
    setOpen(true)
  }
  const onClose = () => {
    setOpen(false)
  }
  const handleChange = value => {
    localStorage.setItem('theme', value)
    setTheme(value)
  }

  return (
    <>
      <main className="app">
        <header className="header__container">
          <div className="header">
            <h3>JSON</h3>
            <div className="header__right">
              <Button type="primary" size="large" className="runBtn" onClick={handleSubmit}>
                运行
              </Button>
              <Button
                icon={
                  <DeleteFilled
                    style={{
                      fontSize: '18px',
                    }}
                  />
                }
                danger
                onClick={() => setValue('{ }')}
              />
            </div>
          </div>

          <div className="header">
            <h3>Typescript</h3>
            <CopyToClipboard text={output} onCopy={() => message.success(`已复制到您的剪切板`)}>
              <Button
                icon={
                  <CopyFilled
                    style={{
                      fontSize: '18px',
                      color: '#0958d9',
                    }}
                  />
                }
              />
            </CopyToClipboard>
          </div>
        </header>

        <div className="code__container">
          <div className="code">
            <Editor
              height="90vh"
              className="editor"
              theme={theme}
              defaultLanguage="json"
              defaultValue="{ }"
              value={value}
              onChange={value => setValue(value)}
            />
          </div>
          <div className="output">
            <Editor
              height="90vh"
              className="editor"
              defaultLanguage="typescript"
              theme={theme}
              options={{
                domReadOnly: true,
                readOnly: true,
              }}
              defaultValue=""
              value={output}
              onChange={value => setOutput(value)}
            />
          </div>
        </div>
      </main>
      <FloatButton
        icon={
          <SettingOutlined
            style={{
              width: '18px',
              height: '18px',
            }}
          />
        }
        onClick={showDrawer}
        tooltip={<div>设置</div>}
      />
      <Drawer title="设置" placement="right" onClose={onClose} open={open}>
        <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
          <Space size="large">
            仓库地址
            <Link
              href="https://github.com/dselegent/JSON-TO-TS"
              target="_blank"
              style={{
                color: '#000',
              }}
            >
              <GithubOutlined
                style={{
                  fontSize: '22px',
                }}
              />
            </Link>
          </Space>
          <Space size="large">
            主题
            <Select
              defaultValue={theme}
              style={{ width: 120 }}
              onChange={handleChange}
              options={[
                { value: 'light', label: 'light' },
                { value: 'vs-dark', label: 'vs-dark' },
              ]}
            />
          </Space>
        </Space>
      </Drawer>
    </>
  )
}

export default App
