import path from 'path'

const INVALID_COMMAND_ERROR = `
run-task must be supplied with a command name matches a file in src/tasks/commands folder
`

const tasksFolder = path.join(__dirname)

const main = async () => {
  const taskName = process.argv[2]

  if (!taskName) {
    console.log('run-task must be supplied with a command name that matches')
  }

  const taskPath = path.join(tasksFolder, taskName)


  try {
    const task = require(taskPath).default
    console.log('running task', taskName, 1)
    await task()

    return 0

  } catch (e) {
    console.log(e)
    console.error(INVALID_COMMAND_ERROR)
    return 1
  }
}

main()
