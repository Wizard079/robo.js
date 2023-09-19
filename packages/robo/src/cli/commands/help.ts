import { color } from '../../core/color.js'
import {  Command, Option } from '../utils/cli-handler.js'
import { logger } from '../../core/logger.js'
import rootCommand from '../index.js'
import { packageJson } from '../utils/utils.js'

const command = new Command('help').description('Shows that menu').handler(helpCommandHandler)
export default command

type commandNames = 'build' | 'start' | 'dev' | 'deploy' | 'doctor' | 'invite' | 'why' | 'help' | 'build plugin'

interface CommandGroup {
	groupId: number
	command: Command
}

interface FormattedCommand {
	groupId: number,
	name: commandNames,
	flags: string,
	description: string,
}

/**
 * Function that is being called when we use the help command in the CLI.
 *
 */
export function helpCommandHandler() {
	logger.log(
		color.yellow(`${color.blue('Robo.js')} ${color.white("-")} Where bot creation meets endless possibilities !`),
		color.gray('(' + packageJson.version + ')\n\n')
	)
	const groups = splitCommandsIntoGroups([["dev", "start", "build"], ["deploy", "doctor", "invite", "why"], ["help"]]);
	prettyPrint(formatCommand(groups));
	
}

/**
 * Splits the commands into seperate groups for meaningful printing.
 * 
 * @param {commandNames} commandNames - Array containing arrays of command names.
 * @return {CommandGroup[]} - returns an array objects with the command and the groupId.
 */

function splitCommandsIntoGroups(commandNames: commandNames[][]): CommandGroup[]{
	const commands = rootCommand.getChildCommands().map((command: Command) => command);

	let groupId = 0;
	const orderedCommands: CommandGroup[] = [];

	for(const commandName of commandNames){
		++groupId;
		const commandAndGroupId = commandName.map((commandName: string): CommandGroup => {
			const command = commands.filter((cmd: Command) => cmd.getName() === commandName)
			if(command.length <= 0) {
				logger.error(color.red(`The ${commandName} command doesn't exist\n`))
				return 
			}
			return {
				groupId: groupId,
				command: command[0]
			};
		});
		orderedCommands.push(...commandAndGroupId);
	}
	return orderedCommands;
}

/**
 * Prints everything in the CLI in a pwetty way uwu.
 *
 * @param {FormattedCommand[]} commands - Array of CustomCommandStructure.
 */
function prettyPrint(commands: FormattedCommand[]) {
	let commandNameStringLength = 0
	let commandOptionsStringLength = 0
	for(let i = 0; i < commands.length; ++i){
		if (commandNameStringLength <  commands[i].name.length) {
			commandNameStringLength =  commands[i].name.length
		}
		if (commandOptionsStringLength <  commands[i].flags.length) {
			commandOptionsStringLength =  commands[i].flags.length
		}
	}

	for(let i = 0; i < commands.length; ++i){
		const command = commands[i];
		const spacesBetweenNameAndFlags = calcSpacing(commandNameStringLength, command.name.length)
		const spaceBetweenFlagsAndDesc = calcSpacing(commandOptionsStringLength, command.flags.length)

		const spacingFlag = '\u0020'.repeat(spacesBetweenNameAndFlags + 5)
		const spacingDesc = '\u0020'.repeat(spaceBetweenFlagsAndDesc + 5)
		const commandLine = `${' ' + command.name}${spacingFlag + command.flags}${
			spacingDesc + command.description
		}`
		const lineBreakSpacesCount =
			command.name.length + spacingFlag.length + command.flags.length + spacingDesc.length + 1

		if (commandLine.length >= 105) {
			if(command.groupId === 1){
				logger.log(
					color.blue(color.bold(' ' + command.name)),
					color.gray(spacingFlag + command.flags),
					color.white(spacingDesc + command.description.slice(0, 68))
				)
			} else if (command.groupId === 2){
				logger.log(
					color.green(color.bold(' ' + command.name)),
					color.gray(spacingFlag + command.flags),
					color.white(spacingDesc + command.description.slice(0, 68))
				)
			} else {
				logger.log(
					color.magenta(color.bold(' ' + command.name)),
					color.gray(spacingFlag + command.flags),
					color.white(spacingDesc + command.description.slice(0, 68))
				)
			}
			breakLine(command.description, lineBreakSpacesCount, 70);
		} else {
			if(command.groupId === 1){
				logger.log(
					color.blue(color.bold(' ' + command.name)),
					color.gray(spacingFlag + command.flags),
					color.white(spacingDesc + command.description.slice(0, 68))
				)
			} else if (command.groupId === 2){
				logger.log(
					color.green(color.bold(' ' + command.name)),
					color.gray(spacingFlag + command.flags),
					color.white(spacingDesc + command.description.slice(0, 68))
				)
			} else {
				logger.log(
					color.magenta(color.bold(' ' + command.name)),
					color.gray(spacingFlag + command.flags),
					color.white(spacingDesc + command.description.slice(0, 68))
				)
			}
		}
	}

	logger.log('\n')
	logger.log(
		color.white(' Learn more about Robo.js at:'),
		color.underline(color.italic(color.cyan('https://roboplay.dev/docs')))
	)
	logger.log(
		color.white(' Join our official discord at:'),
		color.underline(color.italic(color.cyan('https://roboplay.dev/discord'))),
		'\n'
	)

}

/**
 * Calculates the spaces for even columns
 *
 * @param  {number} longestCommandName - Longest command name.
 * @param  {number} commandNameLength - Length of the Command name we are comparing it with.
 * @returns {number} - Returns the number of spaces we have to add to the string.
 */
function calcSpacing(longestCommandName: number, commandNameLength: number): number {
	let y = 0
	if (commandNameLength === longestCommandName) {
		return y
	}
	for (let i = commandNameLength; i < longestCommandName; ++i) {
		++y
	}
	return y
}

// Might wanna re-work that, it splits every "70~" characters. So it's not good for every string.
// Perhaps, adding strict grammar rules to the description might help with that.
// line_break_spaces is basically the spaces I need to reach until the "-" of a command description.

/**
 * Breaks the description into smaller lines to fit the CLi and aligns them.
 *
 * @param {string} desc - Description of the command.
 * @param {number} lineBreakSpaces - Number of spaces to add so the new line is aligned.
 * @param {number} charactersToDivideInto - Number of characters the strings should be divided in.
 * @returns
 */
function breakLine(desc: string, lineBreakSpaces: number, charactersToDivideInto: number) {
	const numberOfDividedLines = Math.floor(desc.length / charactersToDivideInto)
	let d = 140
	for (let i = 0; i < numberOfDividedLines; ++i) {
		if (i === numberOfDividedLines) {
			logger.log('\u0020'.repeat(lineBreakSpaces), ' ' + desc.slice(d).trim())
			logger.log('\n')
			return
		} else if (d === 140) {
			logger.log('\u0020'.repeat(lineBreakSpaces), ' ' + desc.slice(68, 140).trim())
		} else {
			logger.log('\u0020'.repeat(lineBreakSpaces), ' ' + desc.slice(d - 70, d).trim())
		}
		d += 70
	}
}


/**
 * Formats the command into a structured Object. 
 * 
 * @param {commandGroup[]} commandGroup - Array of CommandGroup.
 * @returns {FormattedCommand[]} - Returns the commandGroup array in the shape of FormattedCommand array.
 */
function formatCommand(commandGroup: CommandGroup[]): FormattedCommand[]{
	const formattedCommands: FormattedCommand[] = [];

	commandGroup.forEach((commandObject: CommandGroup, idx: number) => {
		if(!commandObject?.command) return;
		const childCommands = commandObject.command.getChildCommands();
		const alias = commandObject.command
		.getOptions()
		.map((flags: Option) => `${flags.alias}`)
		.join(' ')

		const lastCommandInTheGroup = () => {
			if(commandGroup[idx + 1] !== undefined && commandGroup[idx + 1].groupId !== commandObject.groupId){
				return `${commandObject.command.getDescription()}\n\n`;
			} else {
				return commandObject.command.getDescription();
			}
		}

		if(childCommands.length > 0){
			for(let i = 0; i < childCommands.length; ++i){
				formattedCommands.push({
					groupId: commandObject.groupId,
					name: `${commandObject.command.getName()} ${childCommands[i].getName()}` as commandNames,
					flags: alias,
					description: childCommands[i].getDescription()
				});
			}
		}

		formattedCommands.push({
			groupId: commandObject.groupId,
			name: commandObject.command.getName() as commandNames,
			flags: alias,
			description: lastCommandInTheGroup()
		});

	});

	return formattedCommands;
}

