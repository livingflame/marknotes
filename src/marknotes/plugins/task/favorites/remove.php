<?php
/**
 * Favorites - Remove a note from the favorites
 *
 * Answer to URL like index.php?task=task.favorites.remove&param=xxxx
 */
namespace MarkNotes\Plugins\Task\Favorites;

defined('_MARKNOTES') or die('No direct access allowed');

class Remove extends \MarkNotes\Plugins\Task\Plugin
{
	protected static $me = __CLASS__;
	protected static $json_settings = 'plugins.task.favorites';
	protected static $json_options = 'plugins.options.task.favorites';

	/**
	 * Recursive ksort() function.
	 * Allow to sort an array based on keys, recursively
	 * @link https://gist.github.com/cdzombak/601849#file-ksortrecursive-php
	 */
	private static function ksortRecursive(&$array, $sort_flags = SORT_REGULAR) {
		if (!is_array($array)) return false;
		ksort($array, $sort_flags);
		foreach ($array as &$arr) {
			self::ksortRecursive($arr, $sort_flags);
		}
		return true;
	}

	public static function run(&$params = null) : bool
	{
		$aeFiles = \MarkNotes\Files::getInstance();
		$aeFunctions = \MarkNotes\Functions::getInstance();
		$aeSettings = \MarkNotes\Settings::getInstance();

		// Get the filename to check (f.i. marknotes/Ideas)
		$filename = $aeFunctions->getParam('param', 'string', '', true);
		$filename = $aeFiles->removeExtension($filename);

		// Get the list of favorites from the settings.json file
		$arrOptions = self::getOptions('list', array());

		$bFound = false;

		foreach ($arrOptions as $key=>$fav) {
			// Loop and check if the file in mentionned
			if ($fav == $filename) {
				// Yes : the file is mentionned in the
				// favorites. Just remove it
				unset($arrOptions[$key]);
				$bFound = true;
				break;
			}
		}

		if ($bFound) {
			$rootFolder = $aeSettings->getFolderWebRoot();

			$arrSettings = array();

			// If there is already a settings.json file,
			// get its content
			if ($aeFiles->exists($json = $rootFolder.'settings.json')) {
				$arrSettings = json_decode($aeFiles->getContent($json), true);
			}

			$arrNew = array();
			$arrNew['plugins'] = array();
			$arrNew['plugins']['options'] = array();
			$arrNew['plugins']['options']['task'] = array();
			$arrNew['plugins']['options']['task']['favorites'] = array();
			$arrNew['plugins']['options']['task']['favorites']['list'] = $arrOptions;

			// Don't merge the new list with the old one but replace
			// it
			try {
				unset($arrSettings['plugins']['options']['task']['favorites']['list']);
			} catch (\Exception $e) {
			}

			// And merge it with the new settings
			if (count($arrSettings)>0) {
				$arrSettings = array_replace_recursive($arrSettings, $arrNew);
			} else {
				$arrSettings = $arrNew;
			}

			// Sort the array by key, recursively
			self::ksortRecursive($arrSettings);

			// Write the file
			$aeFiles->rewrite($json, json_encode($arrSettings, JSON_PRETTY_PRINT));
		}

		$arr = array();

		// Prepare the JSON
		$arr['message'] = $aeSettings->getText('favorites_removed', 'The note has been removed from the favorites');
		$arr['status'] = '1';
		$arr['title'] = $aeSettings->getText('favorites_addto', 'Add this note into yours favorites');
		$arr['icon'] = 'star-o';
		$arr['task'] = 'add';

		header('Content-Transfer-Encoding: ascii');
		header('Content-Type: application/json');
		echo json_encode($arr, JSON_PRETTY_PRINT);
		die();
	}
}
