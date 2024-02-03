import { VerdaccioGitlabConfig } from "./gitlab";

function defaultStrategy(split_real_group: string[], split_package_name: string[]): boolean {
    if (split_real_group.length > split_package_name.length) {
      return false;
    }

    for (let i = 0; i < split_real_group.length; i += 1) {
      if (split_real_group[i] !== split_package_name[i]) {
        return false;
      }
    }

    return true;
}

function nameMappingStrategy(splitRealGroup: string[], splitPackageName: string[], config: VerdaccioGitlabConfig): boolean {
  if (splitPackageName?.length === 0 || splitRealGroup?.length === 0) {
    return false;
  }

  const groupsMapping = config.groupsStrategy?.mappings;
  const projectsMapping = config.projectsStrategy?.mappings;

  const treatLowerCase = (source: string, caseSensitive: boolean) => (
    caseSensitive && source
      ? source.toLowerCase()
      : source
  );

  // We just need the last one, because there will be the real group or project name
  const realGroupOrProjectName = splitRealGroup[splitRealGroup.length - 1];

  for (const packageNamePart of splitPackageName) {
    let caseSensitive = config.groupsStrategy?.caseSensitive ?? config.projectsStrategy?.caseSensitive ?? false;

    if (treatLowerCase(packageNamePart, caseSensitive) === treatLowerCase(realGroupOrProjectName, caseSensitive)) {
      return true;
    }

    caseSensitive = config.groupsStrategy?.caseSensitive ?? false;

    const matchedGroup = groupsMapping?.find(groupMapping =>
      treatLowerCase(groupMapping.gitlabName, caseSensitive) === treatLowerCase(realGroupOrProjectName, caseSensitive)
    );

    if (matchedGroup && splitPackageName.length > 1 &&
      treatLowerCase(packageNamePart, caseSensitive) ===
      treatLowerCase(matchedGroup.packageJsonName, caseSensitive)
    ) {
      return true;
    }

    caseSensitive = config.projectsStrategy?.caseSensitive ?? false;

    const matchedPackageJsonName = projectsMapping?.find(project =>
      treatLowerCase(project.packageJsonName, caseSensitive) === treatLowerCase(packageNamePart, caseSensitive)
    );

    if (matchedPackageJsonName &&
      treatLowerCase(matchedPackageJsonName.gitlabName, caseSensitive) ===
      treatLowerCase(realGroupOrProjectName, caseSensitive)
    ) {
      return true;
    }
  }

  return false;
}

export default {
  default: defaultStrategy,
  nameMapping: nameMappingStrategy
}
